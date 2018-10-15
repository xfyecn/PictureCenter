## Quick start

1. Install node, npm

2. Install dependencies

   ```shell
   $ cd PictureCenter
   $ npm install
   $ cd websrc
   $ npm install
   ```

3. Install [**Redis**](http://redis.io/)

   ```shell
   $ brew install redis
   ```

   [Install on Windows](https://github.com/MicrosoftArchive/redis/releases)

   [Configuring redis](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298)

   ```shell
   $ redis-cli
   127.0.0.1:6379> SET picInfo {}
   OK
   ```

4. Set the image save path

   In /PictureCenter/routes/const.js, edit the variable IMG_DIR.
   Image should be saved in PictureCenter/public/ folder in order to serve as static files in Express.

5. Start app

   ```shell
   # start redis
   $ redis-server /usr/local/etc/redis.conf
   
   # start app
   $ npm run start
   ```

6. Open <http://localhost:3000/> to see the app.

## Run the app with pm2

   ```shell
   $ pm2 start ./bin/www
   $ cd websrc
   $ pm2 start node_modules/react-scripts/scripts/start.js --name "pic-viewer"
   ```
