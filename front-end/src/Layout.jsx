import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
    return (
        <div id="root">
            <Header />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <Outlet />
            </main>
        </div>
    );
}