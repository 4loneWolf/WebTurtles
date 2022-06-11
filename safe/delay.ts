function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
//this has to be in async function (-_-)
await delay(1000);
