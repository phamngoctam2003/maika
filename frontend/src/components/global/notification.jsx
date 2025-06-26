import { notification } from 'antd';

export const AntNotification = {
    showNotification: (message, description, type) => {
        const validTypes = ['success', 'error', 'info', 'warning'];
        if (!validTypes.includes(type)) {
            console.warn(`Invalid notification type: ${type}`);
            type = 'info';
        }

        notification[type]({
            message,
            description,
            duration: 5,
        });
    },

    handleError: (error) => {
        if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            let errorMessage = "";
            for (let field in errors) {
                errorMessage += `${errors[field].join(', ')}\n`;
            }
            AntNotification.showNotification("Không thành công", errorMessage, "warning");
        } else if (error.response?.data?.message) {
            AntNotification.showNotification("Không thành công", error.response.data.message, "error");
        } else {
            AntNotification.showNotification("Lỗi không xác định", "Vui lòng thử lại sau", "error");
        }
    }
};