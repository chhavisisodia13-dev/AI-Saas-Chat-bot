const express = require("express");

const router = express.Router();

const multer = require("multer");

const pdfParse = require("pdf-parse");

const fs = require("fs");

const path = require("path");

const {
  GoogleGenerativeAI
} = require("@google/generative-ai");

require("dotenv").config();


// GEMINI
const genAI =
new GoogleGenerativeAI(
  process.env.GROQ_API_KEY
);

const model =
genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});


// MULTER
const upload = multer({
  dest: "uploads/"
});



/* =========================
   PDF ROUTE
========================= */

router.post(
  "/pdf",
  upload.single("pdf"),

  async (req, res) => {

    try {

      const filePath =
      req.file.path;

      const dataBuffer =
      fs.readFileSync(filePath);

      const pdfData =
      await pdfParse(dataBuffer);

      const pdfText =
      pdfData.text;

      const prompt =
      req.body.prompt ||
      "Summarize this PDF";

      const result =
      await model.generateContent(

        `
        PDF CONTENT:

        ${pdfText}

        USER QUESTION:
        ${prompt}
        `
      );

      const response =
      result.response.text();

      res.json({
        reply: response
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message
      });

    }

  }
);




/* =========================
   IMAGE ROUTE
========================= */

router.post(
  "/image",
  upload.single("image"),

  async (req, res) => {

    try {

      const filePath =
      req.file.path;

      const imageBuffer =
      fs.readFileSync(filePath);

      const base64Image =
      imageBuffer.toString("base64");

      const mimeType =
      req.file.mimetype;

      const prompt =
      req.body.prompt ||
      "Explain this image";

      const result =
      await model.generateContent([

        prompt,

        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        }

      ]);

      const response =
      result.response.text();

      res.json({
        reply: response
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message
      });

    }

  }
);

module.exports = router;