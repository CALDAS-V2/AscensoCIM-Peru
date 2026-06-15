#!/bin/bash
cd "d:\Nueva carpeta" || exit 1
npm run lint:types 2>&1 | head -100
