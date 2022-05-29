// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as axios from 'axios'

type Data = {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: 'John Doe' })
}

export default function getGroupsData(req: NextApiRequest, res: NextApiResponse<Data>) {
  axios
    .get(
      `https://api.vk.com/method/groups.getMembers?&group_id=${req.query.group_id}&fields=sex&count=1000&offset=${
        req.query.offset || 0
      }&access_token=1db9d62a1db9d62a1db9d62a001dc5e46211db91db9d62a7fe300f1402520f55447d220&v=5.81`
    )
    .then(function (response) {
      res.send(response.data)
    })
    .catch(function (error) {
      console.log(error)
    })
}
