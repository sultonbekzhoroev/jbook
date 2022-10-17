import * as esbuild from 'esbuild-wasm'
import axios from 'axios';

import { fileCache } from './unpkg-path-plugin';
export const fetchPlugin = (inputCode: string) =>{
    return{
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild){
        build.onLoad({ filter: /.*/ }, async (args: any) => {
        
 
            if (args.path === 'index.js') {
              return {
                loader: 'jsx',
                contents: inputCode
              };
            } 
    
            // Check to see if we have already fetched this file
            // and if it is in the cache 
    
            // const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
    
            // // if it is, return it immediately
            // if(cachedResult){
            //   return cachedResult
            // }
    
    
    
            const {data, request} = await axios.get(args.path)
            const loader = args.path.match(/.css$/) ? 'css' : 'jsx'
            const result: esbuild.OnLoadResult = {
              loader,
              contents: data,
              resolveDir: new URL('./', request.responseURL).pathname
            }
           // store response in cache
            await fileCache.setItem(args.path, result)
    
            return result
          });
        }
    }
}