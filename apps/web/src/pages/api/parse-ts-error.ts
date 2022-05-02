// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import type { ResponseData } from '~/types/response'
import { createTypeScriptErrorMarkdown } from '@better-ts-errors/engine'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const response = await createTypeScriptErrorMarkdown(req.body)
  return res.status(200).json(response)
}
