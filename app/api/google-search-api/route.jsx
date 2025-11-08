import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { searchInput, searchType } = body;

  // Handle image search with Google Custom Search
  if (searchType === "image") {
    const params = {
      key: process.env.GOOGLE_API_KEY,
      cx: process.env.CX,
      q: searchInput,
      searchType: "image",
    };

    return axios
      .get("https://www.googleapis.com/customsearch/v1", {
        params,
        headers: {
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
        },
      })
      .then((res) => NextResponse.json(res.data.items || []))
      .catch((error) => {
        console.error(
          "Image Search Error:",
          error.response?.data || error.message
        );
        return NextResponse.json(
          { error: "Image search failed" },
          { status: 500 }
        );
      });
  }

  // Handle news search with NewsAPI
  if (searchType.toLowerCase() === "search") {
    try {
      // NewsAPI endpoint - using 'everything' for more flexibility
      const newsApiUrl = "https://newsapi.org/v2/everything";

      const params = {
        apiKey: process.env.NEWS_API_KEY,
        q: searchInput,
        language: "en",
        sortBy: "publishedAt", // Sort by most recent
        pageSize: 20, // Number of results (max 100)
        page: 1,
      };

      const response = await axios.get(newsApiUrl, { params });

      // Transform NewsAPI response to match Google Custom Search format
      const transformedArticles = response.data.articles.map((article) => ({
        title: article.title,
        link: article.url,
        displayLink: article.source.name,
        snippet:
          article.description || article.content?.substring(0, 200) + "...",
        formattedUrl: article.url,
        pagemap: {
          cse_thumbnail: article.urlToImage
            ? [{ src: article.urlToImage }]
            : [],
          cse_image: article.urlToImage ? [{ src: article.urlToImage }] : [],
          metatags: [
            {
              "og:image": article.urlToImage,
              "article:published_time": article.publishedAt,
              "og:description": article.description,
              author: article.author,
            },
          ],
        },
        // Additional NewsAPI specific data
        author: article.author,
        publishedAt: article.publishedAt,
        source: article.source,
      }));

      return NextResponse.json(transformedArticles);
    } catch (error) {
      console.error("NewsAPI Error:", error.response?.data || error.message);

      // Return helpful error message
      if (error.response?.status === 401) {
        return NextResponse.json(
          { error: "Invalid NewsAPI key" },
          { status: 401 }
        );
      } else if (error.response?.status === 426) {
        return NextResponse.json(
          { error: "NewsAPI rate limit exceeded" },
          { status: 426 }
        );
      }

      return NextResponse.json(
        { error: "News search failed" },
        { status: 500 }
      );
    }
  }

  // Handle research search with Google Custom Search
  if (searchType.toLowerCase() === "research") {
    try {
      const params = {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.CX,
        q: searchInput,
        num: 10, // More results for research
      };

      const response = await axios.get(
        "https://www.googleapis.com/customsearch/v1",
        {
          params,
          headers: {
            Accept: "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
          },
        }
      );

      // Transform Google Custom Search response
      const transformedResults = response.data.items.map((item) => ({
        title: item.title,
        link: item.link,
        displayLink: item.displayLink,
        snippet: item.snippet,
        formattedUrl: item.formattedUrl,
        pagemap: item.pagemap,
      }));

      return NextResponse.json(transformedResults);
    } catch (error) {
      console.error(
        "Research Search Error:",
        error.response?.data || error.message
      );
      return NextResponse.json(
        { error: "Research search failed" },
        { status: 500 }
      );
    }
  }

  
  return NextResponse.json({ error: "Invalid search type" }, { status: 400 });
}
