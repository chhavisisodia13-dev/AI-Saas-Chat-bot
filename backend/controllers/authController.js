const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.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
});


// AI CHAT FUNCTION
const chatWithAI = async (req, res) => {

  try {

    const { prompt } = req.body;

    const completion = await groq.chat.completions.create({

      messages: [
        {
          role: "user",
          content: prompt
        }
      ],

      model: "llama3-8b-8192"

    });

    const reply =
      completion.choices[0].message.content;

    res.status(200).json({
      reply
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  chatWithAI
};