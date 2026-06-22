const express = require("express");

const router = express.Router();

const multer = require("multer");

const pdfParse = require("pdf-parse");

const fs = require("fs");

const Groq = require("groq-sdk");

require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// MULTER STORAGE
const upload = multer({
  dest: "uploads/"
});


// PDF CHAT ROUTE
router.post(
  "/chat-pdf",
  upload.single("pdf"),
  async (req, res) => {

    try {

      const filePath = req.file.path;

      // READ PDF BUFFER
      const dataBuffer =
        fs.readFileSync(filePath);

      // EXTRACT TEXT
      const pdfData =
        await pdfParse(dataBuffer);

      const pdfText =
        pdfData.text;

      // USER QUESTION
      const question =
        req.body.question;

      // AI RESPONSE
      const completion =
        await groq.chat.completions.create({

          messages: [
            {
              role: "system",

              content:
                `Answer ONLY from this PDF content:\n${pdfText}`
            },

            {
              role: "user",
              content: question
            }
          ],

          model:
            "llama-3.1-8b-instant"
        });

      res.json({
        reply:
          completion.choices[0]
          .message.content
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