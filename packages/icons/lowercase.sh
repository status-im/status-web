#!/bin/zsh

directory=$1

for file in "$directory"/*; do
  filename=$(echo "$file" | tr '[:upper:]' '[:lower:]') # convert to lowercase
  filename="${filename// /-}" # replace spaces with dashes
  filename="${filename//_/-}" # replace underscores with dashes
  mv "$file" "$filename"
done
