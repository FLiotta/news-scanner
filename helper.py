import hashlib
import json
import logging
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup, ResultSet, Tag


def scrap_news(query_text: str):
    url = f"https://www.google.com/search?q={query_text}&tbs=qdr:d&sxsrf=APwXEde4Uyet14y9VrJIN8xGka7Y1APhsQ:1684251242343&source=lnms&tbm=nws&sa=X&ved=2ahUKEwiLq4zolPr-AhUkK7kGHfd7AFcQ_AUoAXoECAEQAw&biw=1792&bih=928&dpr=2"

    req = Request(
        url=url,
        headers={'User-Agent': 'Mozilla/5.0'}
    )

    html = urlopen(req).read()
    bs = BeautifulSoup(html, 'html.parser')

    header_text = bs.find("h1", string="Resultados da pesquisa")

    print(url)

    news_container = header_text.findParent()

    news = []

    for linha in news_container:
        children = linha.findChildren("h3")

        if not children:
            continue

        link = children[0].findChildren("a")[0]
        img = linha.findParent().findParent().findChildren("img")[0]["src"]

        new = {
            "id": hashlib.md5(link.text.encode()).digest().hex(),
            "title": link.text,
            "href": f'https://news.google.com/{link["href"]}',
            "thumbnail": img
        }

        news.append(new)

    return news


def scrap_news_v2(query_text: str, time: str = "d"):
    if time == "d":
        time = "qdr:d"
    elif time == "h":
        time = "qdr:h"

    query_text = query_text.replace(" ", "+")

    url = f"http://www.google.com/search?q={query_text}&tbm=nws&tbs={time},sbd:1"

    print(url)

    req = Request(
        url=url,
        headers={'User-Agent': 'Mozilla/5.0'}
    )

    html = urlopen(req).read()
    bs = BeautifulSoup(html, 'html.parser')

    some_article_image = bs.find("img", {"id": "dimg_1"})
    # TODO Da error en caso de que no haya ninguna noticia en las ultima hora
    news_container: ResultSet = some_article_image.findParent()\
        .findParent()\
        .findParent()\
        .findParent()\
        .findParent()\
        .findParent()\
        .findParent()\
        .findAll("div", recursive=False)

    del news_container[0]
    del news_container[0]

    news = []

    for new_container in news_container:
        try:
            container: Tag = new_container.find("a")

            title_container: Tag = container.select("div")[0]
            info_container: Tag = title_container.find_next_sibling("div")

            title = title_container.find("h3")
            link = container.attrs["href"].split("?q=").pop().split("&")[0]

            description, hour = info_container.findAll(string=True)

            output = {
                "id": hashlib.md5(title.text.encode()).digest().hex(),
                "href": link,
                "title": title.text,
                "description": description,
                "hour": hour
            }

            news.append(output)
        except Exception as e:
            logging.warning(f"[{query_text}] {e}")
            continue

    return news
