import mongoose  from 'mongoose'

const db_name = "MyDb"; 
const cluster_name = "jrinho22"
const cluster_pass = "WlWfRApzJpOxwtHx"
export const port = 3001;

export const uri = `mongodb+srv://${cluster_name}:${cluster_pass}@cluster0.bacmu.mongodb.net/ws-chat`
export const Schema = mongoose.Schema;