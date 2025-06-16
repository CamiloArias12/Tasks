# application setup
# setup stage
npm install

# build
npm run build

# start db instances
echo "Starting Docker Compose services..."
docker-compose up -d

# run stage
npm run dev:all
