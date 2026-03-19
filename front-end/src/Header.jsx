import NavBar from './NavBar'
export default function Header(){

    
    return(
        <>
        <div className="header_section">
            <div className="header-img-container">
                <img className="header-img"
                src="/src/assets/LOOPIN.png" 
                />

            </div>
            
            <NavBar />
        </div>

        
        </>
        
    )

}