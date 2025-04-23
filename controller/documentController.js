const document =  require('../schema/documentSchema');

const getDocument = async (id) => {
    if (!id) return;
    const documentData = await document.findById(id);
    if (documentData) return documentData;
    return await document.create({ _id: id, data: "" });
}


const updateDocument = async(id , data)=>{
    await document.findByIdAndUpdate(id, { data }, { new: true });

}
module.exports = {getDocument,updateDocument}