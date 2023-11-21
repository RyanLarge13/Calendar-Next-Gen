export default authorizeDelete =
  (paramName, prismaModel) => async (req, res, next) => {
    const userId = req.user.id;
    const dataId = req.params[paramName];
    if (!dataId) {
      return res.status(404).json({
        message:
          "No parameter for deleting your data was sent to the server. Please try again",
      });
    }
    try {
      const dataExsists = await prismaModel.findUnique({
        where: { id: dataId },
      });
      if (!dataExsists) {
        return res.status(404).json({
          message:
            "Were sorry, the data you are trying to delete either does not exsist in our record or has already been deleted",
        });
      }
      if (dataExsists) {
        const dataUserId = dataExsists.userId;
        if (userId !== dataUserId) {
          return res
            .status(403)
            .json({
              message:
                "You are not authorized to delete this data. Please do not attempt to delete data unless you are certain of your authority and ownership",
            });
        }
      }
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json({message: "We apologize for the inconvenience. Something Went wrong on the server, please give us some time to fix the issue and try again"})
    }
  };
