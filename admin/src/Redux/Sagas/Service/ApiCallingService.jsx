export async function createRecord(collection, payload) {
    try {
        const token = localStorage.getItem("token");
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/${collection}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                ...(token ? { "authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error(`Error creating record in ${collection}:`, error);
        return { success: false, message: error.message };
    }
}

export async function createMultipartRecord(collection, payload) {
    try {
        const token = localStorage.getItem("token");
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/${collection}`, {
            method: "POST",
            headers: {
                ...(token ? { "authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {})
            },
            body: payload
        });
        return await response.json();
    } catch (error) {
        console.error(`Error creating multipart record in ${collection}:`, error);
        return { success: false, message: error.message };
    }
}

export async function getRecord(collection) {
    try {
        const token = localStorage.getItem("token");
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/${collection}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                ...(token ? { "authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {})
            }
        });
        return await response.json();
    } catch (error) {
        console.error(`Error fetching records from ${collection}:`, error);
        return { success: false, message: error.message };
    }
}

export async function updateRecord(collection, payload) {
    try {
        const token = localStorage.getItem("token");
        const id = payload._id || payload.id;
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/${collection}/${id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                ...(token ? { "authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error(`Error updating record in ${collection}:`, error);
        return { success: false, message: error.message };
    }
}

export async function updateMultipartRecord(collection, payload) {
    try {
        const token = localStorage.getItem("token");
        const id = payload.get('_id') || payload.get('id');
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/${collection}/${id}`, {
            method: "PUT",
            headers: {
                ...(token ? { "authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {})
            },
            body: payload
        });
        return await response.json();
    } catch (error) {
        console.error(`Error updating multipart record in ${collection}:`, error);
        return { success: false, message: error.message };
    }
}

export async function deleteRecord(collection, payload) {
    try {
        const token = localStorage.getItem("token");
        const id = payload._id || payload.id;
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5001"}/api/${collection}/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                ...(token ? { "authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {})
            }
        });
        return await response.json();
    } catch (error) {
        console.error(`Error deleting record in ${collection}:`, error);
        return { success: false, message: error.message };
    }
}