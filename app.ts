import { format } from "https://deno.land/std@0.111.0/datetime/mod.ts";
import { parseFeed } from "https://deno.land/x/rss@0.5.3/mod.ts";
import { tags } from "./tags.ts";

const MAX_DISPLAY_LENGTH = 200;

interface DisplayData {
  title: string;
  url: string;
  entries: Array<Entry>;
}

interface Entry {
  title: string;
  content: string;
  link: string;
  author: string;
  publishedAt: string;
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function displayUsage(): void {
  const usageText = `CLI reader of Qiita tag feed.
	Usage:
	deno_qiita_tag_feed_reader_cli
	deno_qiita_tag_feed_reader_cli <tag>
	deno_qiita_tag_feed_reader_cli help`;

  console.log(usageText);

  return;
}

function trimText(text: string): string {
  return text.replace(/\s+/g, "").substr(0, MAX_DISPLAY_LENGTH) + "...";
}

/*
	It runs on the CLI. So it display need like this.
	-----------------------
	<feed items>
	-----------------------
	<feed items>
	-----------------------
	<feed items>
	-----------------------
	<feed title>
	<feed url>
	======================
*/
function contentDisplay(data: DisplayData): void {
  // Display from the most recent date
  data.entries.sort(function (a: Entry, b: Entry) {
    return new Date(a.publishedAt).valueOf() -
      new Date(b.publishedAt).valueOf();
  });

  for (const entry of data.entries) {
    console.log(entry.title);
    console.log(trimText(entry.content));
    console.log(entry.link);
    console.log(entry.author);
    console.log(entry.publishedAt);
    console.log("-----------------------");
  }

  console.log(data.title);
  console.log(data.url);
}

async function main(tag: string): Promise<void> {
  const feedUrl = `https://qiita.com/tags/${tag}/feed.atom`;

  const response = await fetch(feedUrl);
  const xml = await response.text();
  const feed = await parseFeed(xml);

  let entries: Array<Entry> = [];

  for (const entry of feed.entries) {
    // @ts-ignore
    const { title, content, url, author, published } = entry;

    const entryData: Entry = {
      title: title?.value || "no title",
      content: content?.value || "",
      link: url?.value || "",
      author: author?.name || "",
      publishedAt: published
        ? format(new Date(published), "yyyy/MM/dd HH:mm")
        : "",
    };

    entries.push(entryData);
  }

  const displayData: DisplayData = {
    title: feed.title.value || "no title",
    url: feedUrl,
    entries,
  };

  contentDisplay(displayData);
}

// start
if (Deno.args.length > 0 && ["help", "--help", "-h"].includes(Deno.args[0])) {
  displayUsage();
} else if (Deno.args.length > 0) {
  const tag = Deno.args[0];
  await main(tag);
} else {
  const tag = tags[getRandomInt(tags.length)];
  await main(tag);
}
