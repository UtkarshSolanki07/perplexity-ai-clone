import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { searchInput, searchType } = body;

  const params = {
    key: process.env.GOOGLE_API_KEY,
    cx: process.env.CX,
    q: searchInput,
  };

  if (searchType === 'image') {
    params.searchType = 'image';
  }

  return axios.get('https://www.googleapis.com/customsearch/v1', {
    params,
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  })
  .then(res => NextResponse.json(res.data.items || []))
  .catch(() => NextResponse.json({ error: 'Search failed' }, { status: 500 }));
}
