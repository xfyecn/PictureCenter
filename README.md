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

   [Configuring redis](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298)

   ```shell
   $ redis-cli
   127.0.0.1:6379> SET picInfo {}
   OK
   ```

4. Set image save path

   In /PictureCenter/routes/const.js
   path must be end with '/', and image should be saved in PictureCenter/public/ folder


5. Start app

   ```shell
   # start redis
   $ redis-server /usr/local/etc/redis.conf
   
   # start app
   $ npm run start
   ```

6. Open <http://localhost:3000/> to see the app.

Run the app with pm2

   ```shell
   $ pm2 start app.js
   $ cd websrc
   $ pm2 start node_modules/react-scripts/scripts/start.js --name "pic-viewer"
   ```
