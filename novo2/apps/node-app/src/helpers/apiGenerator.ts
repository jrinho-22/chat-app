import { apiInterface } from "../interfaces/api";
import { Express } from "express";

const apiGenerator = (apiCollection: apiInterface[], instance: Express) => {
    apiCollection.map(api => {
        instance[api.mathod]('/api' + api.path, api.callback)
    })
}

export default apiGenerator