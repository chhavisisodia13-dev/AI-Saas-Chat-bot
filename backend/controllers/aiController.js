require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({

  apiKey:
  process.env.GROQ_API_KEY,

});


// AI CHAT FUNCTION
const chatWithAI = async (req, res) => {

  try {

    const { prompt } = req.body;

    const completion =
    await groq.chat.completions.create({

      messages: [

        {
          role: "user",
          content: prompt
        }

      ],

      model: "llama-3.3-70b-versatile"

    });

    const reply =
    completion.choices[0]
    .message.content;

    res.status(200).json({

      reply: reply

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
      "AI Error"

    });

  }

};

module.exports = {
  chatWithAI
};