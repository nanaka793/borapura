const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID?.trim()
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY?.trim()
const AIRTABLE_USERS_AVATAR_FIELD_ID = process.env.AIRTABLE_USERS_AVATAR_FIELD_ID?.trim()
const AIRTABLE_POSTS_IMAGE_FIELD_ID = process.env.AIRTABLE_POSTS_IMAGE_FIELD_ID?.trim()

if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
  throw new Error('Missing AIRTABLE_BASE_ID or AIRTABLE_API_KEY environment variables.')
}

const API_ENDPOINT = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`
const ATTACHMENT_BASE = `https://content.airtable.com/v0/${AIRTABLE_BASE_ID}`
const FIELD_ID_MAP = {
  UsersAvatar: AIRTABLE_USERS_AVATAR_FIELD_ID,
  PostsImage: AIRTABLE_POSTS_IMAGE_FIELD_ID,
}

type AirtableRecord<T> = {
  id: string
  fields: T
  createdTime: string
}

async function airtableFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_ENDPOINT}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Airtable API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: `${API_ENDPOINT}${path}`,
      errorText: errorText,
    })
    throw new Error(`Airtable error: ${res.status} ${res.statusText} - ${errorText}`)
  }

  return res.json()
}

export async function listRecords<T>(
  table: string,
  params: Record<string, string> = {}
): Promise<Array<AirtableRecord<T>>> {
  const searchParams = new URLSearchParams(params)
  const query = searchParams.toString()
  const path = `/${encodeURIComponent(table)}${query ? `?${query}` : ''}`
  const data = await airtableFetch<{ records: Array<AirtableRecord<T>> }>(path)
  return data.records
}

export async function getRecord<T>(table: string, recordId: string): Promise<AirtableRecord<T> | null> {
  try {
    return await airtableFetch<AirtableRecord<T>>(`/${encodeURIComponent(table)}/${recordId}`)
  } catch (error) {
    return null
  }
}

export async function createRecord<TFields>(
  table: string,
  fields: TFields
): Promise<AirtableRecord<TFields>> {
  return airtableFetch<AirtableRecord<TFields>>(`/${encodeURIComponent(table)}`, {
    method: 'POST',
    body: JSON.stringify({ fields }),
  })
}

export async function updateRecord<TFields>(
  table: string,
  recordId: string,
  fields: Partial<TFields>
): Promise<AirtableRecord<TFields>> {
  return airtableFetch<AirtableRecord<TFields>>(
    `/${encodeURIComponent(table)}/${recordId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    }
  )
}

export async function findRecordByField<T>(
  table: string,
  fieldName: string,
  value: string
): Promise<AirtableRecord<T> | null> {
  const formula = `LOWER({${fieldName}})='${value.replace(/'/g, "\\'").toLowerCase()}'`
  const records = await listRecords<T>(table, { filterByFormula: formula, maxRecords: '1' })
  return records[0] || null
}

function ensureId(value: string | undefined, label: string) {
  if (!value) {
    throw new Error(`Missing ${label}. Please set it in .env.local`)
  }
  return value
}

export async function uploadAttachment(
  file: File,
  {
    recordId,
    fieldKey,
    tableName,
  }: {
    recordId: string
    fieldKey: 'UsersAvatar' | 'PostsImage'
    tableName?: string
  }
) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('filename', file.name)

  const fieldId = ensureId(FIELD_ID_MAP[fieldKey], `field id for ${fieldKey}`)
  const encodedField = encodeURIComponent(fieldId)
  const buffer = Buffer.from(await file.arrayBuffer())
  const payload = {
    contentType: file.type || 'application/octet-stream',
    file: buffer.toString('base64'),
    filename: file.name || 'upload',
  }

  const res = await fetch(
    `${ATTACHMENT_BASE}/${encodeURIComponent(recordId)}/${encodedField}/uploadAttachment`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Failed to upload attachment: ${errorText}`)
  }

  const data = await res.json()
  return data.attachment
}

