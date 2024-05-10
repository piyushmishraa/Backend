

const asyncHandler=(fun)=>{
 return (req,res,next)=>{
    Promise.
    resolve(fun(req,res,next)).
    catch((err)=>{next(err)})
}
}


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

export default asyncHandler;



// const wrapperFunc=(info,fun)=>{
//     return ()=>{
//         console.log(info);
//         console.log("bitch");
//         fun();
//         console.log("ass");
//     }
// }

// const wrappedFunc=()=>{
//     console.log("hello");
// }

// const final=wrapperFunc("lund",wrappedFunc);

// console.log(final);