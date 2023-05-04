cd server || exit
source venv/bin/activate
uvicorn api:app --reload &
cd ../client || exit
yarn dev