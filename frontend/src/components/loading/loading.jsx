
export const Loading = ({ isLoading = false }) => {
    if (isLoading) {
        return (
            <main className="loader">
                <div className="dash first"></div>
                <div className="dash seconde"></div>
                <div className="dash third"></div>
                <div className="dash fourth"></div>
            </main>
        );
    }
    return null;
}