import { NextRequest } from "next/server";
import path from 'path';
import fs, { readFile, writeFile, unlink } from 'fs/promises'
import { fileTypeFromBuffer } from 'file-type';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const src = searchParams.get('src')

  if (src) {
    const filePath = path.join(process.cwd(), 'public', src)

    try {
      const buffer = await readFile(filePath)
      const mime = await getFileMime(buffer)

      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': mime ?? 'text/plain',
          'Cache-Control': 'max-age: 2592000',
        }
      })
    } catch(err) {
      return Response.json({
        status: 400,
        message: 'Failed to read file.',
      })
    }
  } 

  return Response.json({
    status: 400,
    message: "File src is required.",
  })
}

async function getFileMime(buffer: Buffer) {
  const result = await fileTypeFromBuffer(buffer)

  if (result) {
    return result.mime
  }

  return undefined
}

export async function POST(req: Request) {
  const headers = req.headers
  const token = extarctTokenFromHeaders(headers)
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return new Response('No files received', {
      status: 404,
    })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${Date.now()}_${file.name.replaceAll(/\s/g, '_')}`
  const folder = formData.get('folder') as string
  const fileUrl = `${folder}/${filename}`
  const folderPath = path.join(process.cwd(), `public${folder}`)
  const filePath = path.join(folderPath, `/${filename}`)

  // 写入图片
  try {
    await createFolderIfNotExists(folderPath)
    await writeFile(filePath, buffer)
  } catch (error) {
    return new Response('Upload failed', {
      status: 500,
    })
  }

  return Response.json({
    status: 200,
    message: 'File uploaded successfully',
    files: [{
      name: file.name,
      size: file.size,
      url: fileUrl,
    }]
  })
}

export async function DELETE(req: Request) {
  const headers = req.headers
  const token = extarctTokenFromHeaders(headers)
  const { id, url } = await req.json()
  const filePath = path.join(process.cwd(), `public${url}`)
  
  if (await fileExists(filePath)) {
    await unlink(filePath)
  }

  return Response.json({
    status: 200,
    message: 'File deleted successfully',
  })
}

function extarctTokenFromHeaders(headers: Headers) {
  const authorization = headers.get('authorization')
  if (!authorization) {
    return null
  }
  const token = authorization.split(' ')[1]
  return token
}

async function createFolderIfNotExists(folderPath: string) {
  try {
    await fs.access(folderPath)
  } catch(err) {
    try {
      await fs.mkdir(folderPath, { recursive: true})
    } catch(err) {
      throw new Error('Failed creating folder')
    }
  }
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath)
    return true
  } catch(err) {
    return false
  }
}