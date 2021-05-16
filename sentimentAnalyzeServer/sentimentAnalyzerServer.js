const express = require('express');
const app = new express();
const bodyParser = require('body-parser');

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.use(bodyParser.json());

const dotenv = require('dotenv');
dotenv.config()

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth')
    
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key
        }),
        serviceUrl: api_url

    })
    return naturalLanguageUnderstanding; 
}

// A function to get emotion

const analyzeEmotionText = (toBeAnalyzed, res) => {
    // get intstance of NLU
    let nluInst = getNLUInstance();

    // put text into params object for analysis
    const emotionParams = {
        text: toBeAnalyzed,
        features: {'emotion': {}}
    }

    nluInst.analyze(emotionParams)
        // .then(analysisResult => {
        //     res.send(analysisResult.result.emotion.document)
        // }).catch(err => {
        //     res.send(err.toString())
        // });
        .then(analysisResults => {
            let resultAnalysis = JSON.stringify(
                analysisResults.result.emotion.document.emotion
                , null, 2);
            res.send(resultAnalysis)
        }).catch(err => {
            res.send(err.toString())
        })
}


const analyzeEmotionUrl = (toBeAnalyzed, res) => {
    // get intstance of NLU
    let nluInst = getNLUInstance();

    // put text into params object for analysis
    const emotionParams = {
        url: toBeAnalyzed,
        features: {'emotion': {}}
    }

    nluInst.analyze(emotionParams)
        .then(analysisResults => {
            let resultAnalysis = JSON.stringify(
                analysisResults.result.emotion.document.emotion
                , null, 2);
            res.send(resultAnalysis)

        }).catch(err => {
            res.send(err.toString())
        });
}


// A function to get sentiment


const analyzeSentimentText = (toBeAnalyzed, res) => {
    // get intstance of NLU
    let nluInst = getNLUInstance();

    // put text into params object for analysis
    const sentimentParams = {
        text: toBeAnalyzed,
        features: {'sentiment': {}}
    }

    nluInst.analyze(sentimentParams)
        .then(analysisResult => {
            res.send(analysisResult.result.sentiment.document.label)
        }).catch(err => {
            res.send(err.toString())
        });
}


const analyzeSentimentUrl = (toBeAnalyzed, res) => {
    // get intstance of NLU
    let nluInst = getNLUInstance();

    // put text into params object for analysis
    const sentimentParams = {
        url: toBeAnalyzed,
        features: {'sentiment': {}}
    }

    nluInst.analyze(sentimentParams)
        .then(analysisResult => {
            res.send(analysisResult.result.sentiment.document.label)
        }).catch(err => {
            res.send(err.toString())
        });
}

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let urlToAnalyze = req.query.url;
    analyzeEmotionUrl(urlToAnalyze, res)

    // return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    let urlToAnalyze = req.query.url;
    analyzeSentimentUrl(urlToAnalyze, res)
    // return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    console.log("Is this thing on??")
    console.log('this is the request: ', req.query.text)
    let textToAnalyze = req.query.text;
    analyzeEmotionText(textToAnalyze, res)

    // return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    let textToAnalyze = req.query.text;
    analyzeSentimentText(textToAnalyze, res)

    // return res.send("text sentiment for "+req.query.text);
});



let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

