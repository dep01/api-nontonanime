const express = require("express");
const cheerio = require("cheerio");
const api_client = require("../helpers/api_client");
const res_message = require("../helpers/res_message");

class NontonAnimeRoutes {
  _uri = "https://nontonanimeid.lol/";
  _router = express.Router();

  get router() {
    return this._router;
  }
  get uri() {
    return this._uri;
  }
  constructor() {
    this._configure();
  }
  _configure() {
    this._router.get("/", async (req, res) => {
      const response = await api_client.get(this.uri);
      let data = [];
      if (response != "") {
        const $ = cheerio.load(response);
        $("main article").each(function (i, elem) {
          data[i] = {
            title: $(this).find("h3").text().trim(),
            episode: $(this).find(".sera a div .types").text().trim(),
            watch_url: $(this).find(".sera a").attr("href"),
            image_url: $(this).find(".sera a div img ").attr("data-src"),
          };
        });
        return res.status(200).json(
          res_message.resMessage({
            success: true,
            message: "Data is success to load",
            status: 200,
            data: data,
          })
        );
      }

      return res.status(500).json(
        res_message.resMessage({
          success: false,
          message: "",
          data: null,
          status: 404,
        })
      );
    });
    this._router.get("/watch_anime", async (req, res) => {
      const response = await api_client.get(res_message.valXss(req.query.uri));
      let data = {};
      if (response != "") {
        const $ = cheerio.load(response);
        data = {
          watch_url: $("iframe").attr("data-litespeed-src"),
        };

        return res.status(200).json(
          res_message.resMessage({
            success: true,
            message: "Data is success to load",
            status: 200,
            data: data,
          })
        );
      }

      return res.status(500).json(
        res_message.resMessage({
          success: false,
          message: "",
          data: null,
          status: 404,
        })
      );
    });

    this._router.get("/episode_list", async (req, res) => {
      const response = await api_client.get(res_message.valXss(req.query.uri));
      let data = {};
      if (response != "") {
        const $ = cheerio.load(response);
        let episode_list = [];
        $(".episodelist ul li").each(function (i, elem) {
          episode_list.push({
            date: $(this).find(".t3").text().trim(),
            episode: $(this).find("a").text().trim(),
            watch_url: $(this).find("a").attr("href"),
          });
        });
        const data = {
          image_url: $(".poster img").attr("data-src"),
          desc: $(".seriesdesc p").text().trim(),
          episode_list,
        };

        return res.status(200).json(
          res_message.resMessage({
            success: true,
            message: "Data is success to load",
            status: 200,
            data: data,
          })
        );
      }

      return res.status(500).json(
        res_message.resMessage({
          success: false,
          message: "",
          data: null,
          status: 404,
        })
      );
    });
    this._router.get("/anime_list", async (req, res) => {
      const response = await api_client.get(`${this.uri}/anime/page/1`);
      if (response != "") {
        const $ = cheerio.load(response);
        let data = [];
        let current_page = page;
        let max_page = 1;
        $("main #a-z ul li").each(function (i, elem) {
          let genre = [];
          $(this)
            .find(".genrebatas .genre")
            .each(function (index, elemen) {
              genre.push($(this).text());
            });
          data.push({
            genre,
            title: $(this).find("h2").text().trim(),
            desc: $(this).find(".descs").text().trim(),
            watch_url: $(this).find("a").attr("href"),
            image_url: $(this).find("a div img").attr("data-src"),
          });
        });
        let all_page = $(".pagination .pages").text().trim();
        let str_page = "";
        let str_page_reverse = "";
        let is_current_page = false;
        for (let index = all_page.length - 1; index > 0; index--) {
          if (isNaN(parseInt(all_page[index]))) {
            is_current_page = true;
          } else {
            if (is_current_page) {
              current_page = parseInt(all_page[index]);
            } else {
              str_page += `${all_page[index]}`;
            }
          }
        }
        for (let index = str_page.length - 1; index >= 0; index--) {
          str_page_reverse += `${str_page[index]}`;
        }
        max_page = parseInt(str_page_reverse);
        const resp = {
          data,
          current_page,
          max_page,
        };

        return res.status(200).json(
          res_message.resMessage({
            success: true,
            message: "Data is success to load",
            status: 200,
            data: resp,
          })
        );
      }

      return res.status(500).json(
        res_message.resMessage({
          success: false,
          message: "",
          data: null,
          status: 404,
        })
      );
    });
    this._router.get("/search", async (req, res) => {
      const search = res_message.valXss(req.query.search);
      const response = await api_client.get(`${this.uri}/?s=${search}`);
      if (response != "") {
        const $ = cheerio.load(response);
        let data = [];
        $("main .result ul li").each(function (i, elem) {
          let genre = [];
          $(this)
            .find(".genrebatas .genre")
            .each(function (index, elemen) {
              genre.push($(this).text());
            });
          let dtas = {
            genre,
            title: $(this).find("h2").text().trim(),
            desc: $(this).find(".descs").text().trim(),
            watch_url: $(this).find("a").attr("href"),
            image_url: $(this).find("a div img").attr("src"),
          };
          // console.log(dtas);
          data.push(dtas);
        });

        // const resp = {
        //     data,
        //     current_page,
        //     max_page
        // }

        return res.status(200).json(
          res_message.resMessage({
            success: true,
            message: "Data is success to load",
            status: 200,
            data: data,
          })
        );
      }

      return res.status(500).json(
        res_message.resMessage({
          success: false,
          message: "",
          data: null,
          status: 404,
        })
      );
    });
    this._router.get("/anime_list_alpha", async (req, res) => {
      const response = await api_client.get(`${this.uri}/anime/?mode=list`);
      if (response != "") {
        const $ = cheerio.load(response);
        let data = [];
        let list_letter = [];

        $("main #a-z .letter-group").each(function (i, elem) {
          list_letter.push($(this).find(".letter-cell span").text());
          let list_anime = [];
          $(this)
            .find(".row-cells .title-cell")
            .each(function (index, elemen) {
              // genre.push($(this).text());
              list_anime.push({
                title: $(this).find("a").text().trim(),
                watch_url: $(this).find("a").attr("href"),
              });
            });
          data.push({
            letter: $(this).find(".letter-cell span").text(),
            list_anime,
          });
        });
        return res.status(200).json(
          res_message.resMessage({
            success: true,
            message: "Data is success to load",
            status: 200,
            data: {
              list_letter,
              data,
            },
          })
        );
      }

      return res.status(500).json(
        res_message.resMessage({
          success: false,
          message: "",
          data: null,
          status: 404,
        })
      );
    });
  }
}
module.exports = new NontonAnimeRoutes().router;
