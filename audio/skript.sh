#!/bin/bash

dir="${1:-.}"   # aktuelles Verzeichnis, wenn kein Pfad angegeben

echo "Datei;Dauer (Sekunden)"
echo "----------------------"

find "$dir" -type f -name "*.mp3" | while read -r file; do
    # Dauer auslesen und nur die Zahl extrahieren
    duration=$(afinfo "$file" 2>/dev/null | grep "duration" | awk -F': ' '{print $2}' | awk '{print $1}')
    
    if [[ -n "$duration" ]]; then
        echo "$(basename "$file");$duration"
    fi
done
