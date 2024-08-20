import axios from 'axios';

export async function fetchBurnTransaction(wallets: string[], tokens: string[], receiver?: string, apiKey?: string) {
    const server = "https://soldustvacuum.app";
    const response = await axios.post(server + '/api/getBurnTransaction', {
        wallets,
        tokens,
        receiver
    },{
        headers: {
            'Content-Type': 'application/json',
            'X-SDV-KEY': apiKey
        }});
    return response.data;
}

export async function fetchBurnAllTransaction(wallets: string[], tokens: string[], receiver?: string, apiKey?: string) {
    const server = "https://soldustvacuum.app";
    const response = await axios.post(server+'/api/getBurnAllTransaction', {
        wallets,
        tokens,
        receiver
    },{
        headers: {
            'Content-Type': 'application/json',
            'X-SDV-KEY': apiKey
        }});
    return response.data;
}
