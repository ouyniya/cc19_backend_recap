# Server

## Step 1 create package.json 
```bash
npm init -y
```

## Step 2 install package
```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma dotenv
```

สร้างไฟล์ .env และ /prisma ที่มีไฟล์ schema.prisma
```bash
npx prisma init
```

### สร้างไฟล์ `.gitignore`
```
/node_modules
.env
```

## Step 3 Git
```bash
git init
git add .
git commit -m "start"
```

next step
copy code from repo
```bash
git remote add origin https://github.com/ouyniya/cc19_backend_recap.git
git branch -M main
git push -u origin main
```