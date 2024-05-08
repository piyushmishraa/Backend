

const asyncHandler=(fun)=>{(req,res,next)=>{
    Promise.
    resolve(fun(req,res,next)).
    catch((err)=>{next(err)})
}}


// const asyncHandler=(fun)=>{async(req,res,next)=>{
//     try {
//        await fun(req,res,next)
//     } catch (error) {
//         res.send(error.code).json({
//             success:false,
//             message:error.message
//         })
        
//     }
// }}