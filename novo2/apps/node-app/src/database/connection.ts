import mongoose from "mongoose"
import { uri } from "../helpers/const";
// import seed from "./seed";
import "../schemas"

const mongooseConnect = async () =>{
    await mongoose.connect(uri);
    // await seed()
}

export default mongooseConnect