import express from 'express';
import { Express } from "express";
import http from 'http';
import { apiInterface } from '../interfaces/api';
import apiGenerator from '../helpers/apiGenerator';
import cors from 'cors';

class Server {
    static _instance: Server | null = null;
    private _app: Express
    private _httpServer: http.Server

    constructor() {
        if (!Server._instance) {
            Server._instance = this;
            this.init()
        }
        return Server._instance;
    }

    init() {
        this._app = express()
        this._app.use(cors()) 
        this._app.use(express.json());
        this._httpServer = http.createServer(this._app);
    }

    generateApis(apis: apiInterface[]) {
        apiGenerator(apis, this._app)
    }

    get app() {
        return this._app
    }

    get httpServer() {
        return this._httpServer
    }
}

const instance = new Server()
export default instance