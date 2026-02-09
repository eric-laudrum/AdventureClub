export default function EditArticlePage(){

    const handleDeleteImage = async( imageUrl ) => {
        // Confirm before delete
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");

        // Cancel delete
        if( !confirmDelete ){
            return;
        }

        // Continue with deletion
        try{
            const token = await auth.currentUser.getIdToken();
            const response = await axios.delete(`/api/articles/${name}/images`, {
                data: { imageUrl },
                headers: { authtoken: token }
            });
        } catch( err ){
            console.error("Error deleting image: ", err );
            alert( "Error: Failed to delete image");
        }

    };

}