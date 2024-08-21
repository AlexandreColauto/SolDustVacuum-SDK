import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import fs from 'fs';
import { fetchBurnAllTransaction, fetchBurnTransaction } from "./soldustvacuum";

export class SDV {
    apiKey: string

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    async closeAccounts(wallet: Keypair | string, tokens: string[], rpcUrl?: string, feeReceiver?: string) {
        if (!this.apiKey) {
            throw new Error("Please provide a valid API key")
        }
        if (!wallet) {
            throw new Error("Please provide a valid wallet")
        }
        if (!tokens || tokens.length === 0) {
            throw new Error("Please provide a valid token list, or use burnAllTokens ")
        }
        const connection = new Connection(rpcUrl || "https://api.mainnet-beta.solana.com");
        let wlt = this.prepareWallet(wallet)
        const transaction = await fetchBurnTransaction([wlt.publicKey.toString()], tokens, feeReceiver, this.apiKey)
        const signatures = []
        for (const tx of transaction) {
            const instructions = tx.transactions
            for (const i of instructions) {
                const buffer = Buffer.from(i, 'base64')
                const tx = VersionedTransaction.deserialize(buffer)
                tx.sign([wlt])
                const sig = await connection.sendTransaction(tx, {
                    maxRetries: 5,
                    preflightCommitment: "confirmed"
                })
                signatures.push(sig)
            }
        }
        return signatures
    }
    // close list of token from many wallets
    async closeAccountsBatch(wallets: Keypair[] | string[] | string, tokens: string[], rpcUrl?: string, feeReceiver?: string) {
        if (!this.apiKey) {
            throw new Error("Please provide a valid API key")
        }
        if (!wallets) {
            throw new Error("Please provide a valid wallet")
        }
        if (!tokens || tokens.length === 0) {
            throw new Error("Please provide a valid token list, or use burnAllTokensBatch ")
        }
        const connection = new Connection(rpcUrl || "https://api.mainnet-beta.solana.com");
        const wlts: Record<string, Keypair> = {}
        if (Array.isArray(wallets)) {
            wallets.map((w) => {
                const wlt = this.prepareWallet(w)
                wlts[wlt.publicKey.toString()] = wlt
            })
        } else {
            throw new Error("Invalid wallet")
        }
        const transaction = await fetchBurnTransaction(Object.keys(wlts), tokens, feeReceiver, this.apiKey)
        const signatures = []
        for (const tx of transaction) {
            const instructions = tx.transactions
            const wallet = wlts[tx.wallets]
            for (const i of instructions) {
                const buffer = Buffer.from(i, 'base64')
                const tx = VersionedTransaction.deserialize(buffer)
                tx.sign([wallet])
                const sig = await connection.sendTransaction(tx, {
                    maxRetries: 5,
                    preflightCommitment: "confirmed"
                })
                signatures.push(sig)
            }
        }
        return signatures
    }
    async closeAccountsFolder(wallets: string, tokens: string[], rpcUrl?: string, feeReceiver?: string) {
        if (!this.apiKey) {
            throw new Error("Please provide a valid API key")
        }
        if (!wallets) {
            throw new Error("Please provide a valid wallet")
        }
        if (!tokens || tokens.length === 0) {
            throw new Error("Please provide a valid token list, or use burnAllTokensFolder ")
        }
        const connection = new Connection(rpcUrl || "https://api.mainnet-beta.solana.com");
        const wlts: Record<string, Keypair> = {}
        const walletFolder = fs.readdirSync(wallets, 'utf8');
        for (const file of walletFolder) {
            if (!file.endsWith(".json")) {
                continue
            }
            const walletFile = fs.readFileSync(wallets + "/" + file, 'utf8');
            const pkArray = JSON.parse(walletFile.toString())
            if (!Array.isArray(pkArray) && pkArray.length !== 64) {
                continue
            }
            const wallet = Keypair.fromSecretKey(new Uint8Array(pkArray));
            wlts[wallet.publicKey.toString()] = wallet
        }
        const transaction = await fetchBurnTransaction(Object.keys(wlts), tokens, feeReceiver, this.apiKey)
        const signatures = []
        for (const tx of transaction) {
            const instructions = tx.transactions
            const wallet = wlts[tx.wallets]
            for (const i of instructions) {
                const buffer = Buffer.from(i, 'base64')
                const tx = VersionedTransaction.deserialize(buffer)
                tx.sign([wallet])
                const sig = await connection.sendTransaction(tx, {
                    maxRetries: 5,
                    preflightCommitment: "confirmed"
                })
                signatures.push(sig)
            }
        }
        return signatures
    }
    async closeAllAccounts(wallet: Keypair | string, tokensToKeep?: string[], rpcUrl?: string, feeReceiver?: string) {
        if (!this.apiKey) {
            throw new Error("Please provide a valid API key")
        }
        if (!wallet) {
            throw new Error("Please provide a valid wallet")
        }
        if (!tokensToKeep) {
            tokensToKeep = []
        }
        const connection = new Connection(rpcUrl || "https://api.mainnet-beta.solana.com");
        let wlt = this.prepareWallet(wallet)
        const transaction = await fetchBurnAllTransaction([wlt.publicKey.toString()], tokensToKeep, feeReceiver, this.apiKey)
        const signatures = []
        for (const tx of transaction) {
            const instructions = tx.transactions
            for (const i of instructions) {
                const buffer = Buffer.from(i, 'base64')
                const tx = VersionedTransaction.deserialize(buffer)
                tx.sign([wlt])
                const sig = await connection.sendTransaction(tx, {
                    maxRetries: 5,
                    preflightCommitment: "confirmed"
                })
                signatures.push(sig)
            }
        }
        return signatures
    }
    async closeAllAccountsBatch(wallets: Keypair[] | string[] | string, tokensToKeep?: string[], rpcUrl?: string, feeReceiver?: string) {
        if (!this.apiKey) {
            throw new Error("Please provide a valid API key")
        }
        if (!wallets) {
            throw new Error("Please provide a valid wallet")
        }
        if (!tokensToKeep) {
            tokensToKeep = []
        }

        const connection = new Connection(rpcUrl || "https://api.mainnet-beta.solana.com");
        const wlts: Record<string, Keypair> = {}
        if (Array.isArray(wallets)) {
            wallets.map((w) => {
                const wlt = this.prepareWallet(w)
                wlts[wlt.publicKey.toString()] = wlt
            })
        } else {
            throw new Error("Invalid wallet")
        }
        const transaction = await fetchBurnAllTransaction(Object.keys(wlts), tokensToKeep, feeReceiver, this.apiKey)
        const signatures = []
        for (const tx of transaction) {
            const instructions = tx.transactions
            const wallet = wlts[tx.wallets]
            for (const i of instructions) {
                const buffer = Buffer.from(i, 'base64')
                const tx = VersionedTransaction.deserialize(buffer)
                tx.sign([wallet])
                const sig = await connection.sendTransaction(tx, {
                    maxRetries: 5,
                    preflightCommitment: "confirmed"
                })
                signatures.push(sig)
            }
        }
        return signatures
    }
    async closeAllAccountsFolder(wallets: string, tokensToKeep: string[], rpcUrl?: string, feeReceiver?: string) {
        if (!this.apiKey) {
            throw new Error("Please provide a valid API key")
        }
        if (!wallets) {
            throw new Error("Please provide a valid wallet")
        }
        if (!tokensToKeep) {
            tokensToKeep = []
        }
        const connection = new Connection(rpcUrl || "https://api.mainnet-beta.solana.com");
        const wlts: Record<string, Keypair> = {}
        const walletFolder = fs.readdirSync(wallets, 'utf8');
        for (const file of walletFolder) {
            if (!file.endsWith(".json")) {
                continue
            }
            const walletFile = fs.readFileSync(wallets + "/" + file, 'utf8');
            const pkArray = JSON.parse(walletFile.toString())
            if (!Array.isArray(pkArray) && pkArray.length !== 64) {
                console.log("invalid file", pkArray)
                continue
            }
            const wallet = Keypair.fromSecretKey(new Uint8Array(pkArray));
            wlts[wallet.publicKey.toString()] = wallet
        }
        const transaction = await fetchBurnAllTransaction(Object.keys(wlts), tokensToKeep, feeReceiver, this.apiKey)
        const signatures = []
        for (const tx of transaction) {
            const instructions = tx.transactions
            const wallet = wlts[tx.wallets]
            for (const i of instructions) {
                const buffer = Buffer.from(i, 'base64')
                const tx = VersionedTransaction.deserialize(buffer)
                tx.sign([wallet])
                const sig = await connection.sendTransaction(tx, {
                    maxRetries: 5,
                    preflightCommitment: "confirmed"
                })
                signatures.push(sig)
            }
        }
        return signatures
    }

    private prepareWallet(wallet: Keypair | string) {
        let wlt
        if (typeof wallet === "string") {
            const walletFile = fs.readFileSync(wallet, 'utf8');
            wlt = Keypair.fromSecretKey(new Uint8Array(JSON.parse(walletFile.toString())));
        } else if (wallet instanceof Keypair) {
            wlt = wallet
        } else {
            throw new Error("Invalid wallet")
        }
        return wlt
    }
    async closeAccountsSimulate(wallet: Keypair | string, tokens: string[], rpcUrl?: string, feeReceiver?: string) {
        if (!this.apiKey) {
            throw new Error("Please provide a valid API key")
        }
        if (!wallet) {
            throw new Error("Please provide a valid wallet")
        }
        if (!tokens || tokens.length === 0) {
            throw new Error("Please provide a valid token list, or use burnAllTokens ")
        }
        const connection = new Connection(rpcUrl || "https://api.mainnet-beta.solana.com");
        let wlt = this.prepareWallet(wallet)
        const transaction = await fetchBurnTransaction([wlt.publicKey.toString()], tokens, feeReceiver, this.apiKey)
        const signatures = []
        for (const tx of transaction) {
            const instructions = tx.transactions
            for (const i of instructions) {
                const buffer = Buffer.from(i, 'base64')
                const tx = VersionedTransaction.deserialize(buffer)
                tx.sign([wlt])
                const sig = await connection.simulateTransaction(tx, {
                    commitment: "confirmed"
                })
                signatures.push(sig)
            }
        }
        return signatures
    }

}
