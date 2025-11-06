from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
import uvicorn
import simpleaudio as sa  # zum Abspielen von Audio
from pathlib import Path
import time

# play audio
from pydub import AudioSegment
from pydub.playback import play

app = FastAPI()

# CORS erlauben (damit dein Frontend localhost:5173 oder so zugreifen kann)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # im produktiven Einsatz bitte anpassen!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = 1 #OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Pfad für deine MP3-Dateien
AUDIO_DIR = Path(__file__).parent / "audio"
AUDIO_DIR.mkdir(exist_ok=True)


@app.get("/api/ping")
def ping():
    return {"ok": True, "msg": "Backend up"}


@app.post("/api/chat")
async def chat(message: dict):
    try:
        user_text = message.get("message", "")
        if not user_text:
            return JSONResponse({"error": "No message provided"}, status_code=400)

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Du bist ein freundlicher Assistent."},
                {"role": "user", "content": user_text},
            ],
        )

        reply = response.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        with open("temp_audio.wav", "wb") as f:
            f.write(await file.read())

        with open("temp_audio.wav", "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                file=audio_file,
                model="gpt-4o-mini-transcribe"
            )

        return {"text": transcript.text}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


def play_from_file_path(filename):
        file_path = Path(filename)
        # if not file_path.exists():
        #     return {"error": f"Datei '{file_path}' nicht gefunden"}

        # Datei laden und abspielen
        print(f"🎵 Spiele Datei ab: {filename}")
        audio = AudioSegment.from_file(file_path)  # <— Hier einfach Path übergeben, kein .read()!
        play(audio)

        return {"ok": True, "msg": f"Spiele {filename}"}


class PlayRequest(BaseModel):
    section: int

@app.post("/api/play")
def play_audio(req: PlayRequest):
    section = req.section
    vorlesen = f"audio/{section} vorlesen.mp3"
    frage = f"audio/{section} frage.mp3"
    antwort = f"audio/{section} antwort.mp3"
    try:
        play_from_file_path(vorlesen)
        time.sleep(1.5)
        play_from_file_path(frage)
        if section == "1":
            time.sleep(5)
        elif section == "2":
            time.sleep(5)
        elif section == "3":
            time.sleep(5)
        else:
            time.sleep(5)
        play_from_file_path(antwort)

    except Exception as e:
        print("❌ Fehler:", e)
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
