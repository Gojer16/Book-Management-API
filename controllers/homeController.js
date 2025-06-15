


exports.grettings = async (req, res, next) => {
    try {
        return res.status(200).json({
            message: "Hello, World"
        })
    } 
    catch (err) 
    {
        next(err);
    }
};