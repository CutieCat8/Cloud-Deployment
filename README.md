# Cloud Deploy microservices

โปรเจกต์นี้แยกเป็น 2 services และเชื่อมฐานข้อมูลบน MongoDB Atlas:

- `frontend`: Nginx ให้บริการหน้าเว็บ และส่งต่อ `/api/*` ไปยัง API
- `api`: Express + TypeScript สำหรับ REST API
- `MongoDB Atlas`: ฐานข้อมูลบน cloud โดย API อ่าน connection string จาก `.env`

ทั้งสอง services เป็น web server แยกกัน:

- Frontend server: http://localhost:3001/test.html
- API server โดยตรง: http://localhost:3002/api/users
- API ผ่าน frontend proxy: http://localhost:3001/api/users

## เริ่มระบบ

ต้องเปิด Docker Desktop ก่อน แล้วรัน:

```powershell
docker compose up --build -d
```

Docker Hub images:

- `sealovsalad/cloud-deploy-frontend:latest`
- `sealovsalad/cloud-deploy-api:latest`

เมื่อนำ frontend และ API ขึ้น Azure Web App คนละตัว ให้ตั้งค่า environment variable
`API_UPSTREAM` ของ frontend เป็น URL ของ API Web App เช่น
`https://YOUR-API-APP.azurewebsites.net`

ไฟล์ `.env` ต้องมีค่า Atlas connection string และไฟล์นี้จะไม่ถูกนำเข้า image:

```dotenv
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE
PORT=3001
```

ตัวเลือก `-d` จะรัน containers เบื้องหลังและคืน prompt ให้ Terminal ทันที

ตรวจสถานะหรือดู log เมื่อต้องการ:

```powershell
docker compose ps
docker compose logs --tail=50
```

เปิดใช้งานที่:

- หน้าเว็บ: http://localhost:3001/test.html
- Users API: http://localhost:3001/api/users

หยุดระบบด้วย `Ctrl+C` แล้วรัน:

```powershell
docker compose down
```

ต้องเพิ่ม public IP ของเครื่องใน Atlas Project > Network Access เพื่อให้ API เชื่อมต่อฐานข้อมูลได้

## CI/CD ด้วย GitHub Actions

Pipeline ใช้ workflows 4 ไฟล์ตามลำดับ:

1. `Workflow1 - CI`: ติดตั้ง dependencies, build และ test
2. `Workflow2 - Publish API`: build และ push API image ไป Docker Hub
3. `Workflow3 - Publish Frontend`: build และ push frontend image ไป Docker Hub
4. `Workflow4 - Deploy Azure`: deploy image ที่ติด tag ด้วย commit SHA ไป Azure Web Apps สองตัว

เพิ่ม Repository secrets ที่ GitHub > Settings > Secrets and variables > Actions:

- `DOCKERHUB_TOKEN`: Docker Hub access token ของบัญชี `sealovsalad`
- `AZURE_API_PUBLISH_PROFILE`: เนื้อหาทั้งหมดของ publish profile จาก API Web App
- `AZURE_FRONTEND_PUBLISH_PROFILE`: เนื้อหาทั้งหมดของ publish profile จาก frontend Web App

เพิ่ม Repository variables:

- `AZURE_API_APP_NAME`: ชื่อ API Web App
- `AZURE_FRONTEND_APP_NAME`: ชื่อ frontend Web App
- `CICD_ENABLED`: ตั้งเป็น `true` หลังเพิ่ม secrets และ variables ครบแล้ว

Workflow1 จะรัน test ทุกครั้งที่ push หรือเปิด pull request ส่วนการ push images และ deploy
จะเริ่มทำงานเมื่อ `CICD_ENABLED=true` เท่านั้น

ตั้งค่า API Web App ให้ใช้ container port `3000` พร้อม `PORT=3000` และ `MONGODB_URI`
ส่วน frontend Web App ใช้ container port `8080` และตั้ง `API_UPSTREAM` เป็น URL ของ API Web App
