import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime/context';
import express from 'express';

const angularAppEngine = new AngularAppEngine();  
const app = express();


app.use(express.static('dist/browser'));


app.use('/users-list/:id', async (req, res) => {
  const renderMode = 'full';  

  const requestForNetlify = new Request(req.url, {
    method: req.method,
    headers: req.headers as any,  
    body: req.body,  
  });

  try {
    
    const response = await angularAppEngine.handle(requestForNetlify);

    if (response) {
      res.send(response);  
    } else {
      res.status(404).send('Not found');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext();  
  const result = await angularAppEngine.handle(request, context);  
  return result || new Response('Not found', { status: 404 }); 
}

export const reqHandler = createRequestHandler(netlifyAppEngineHandler);  


