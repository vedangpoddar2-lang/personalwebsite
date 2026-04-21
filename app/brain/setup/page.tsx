export default function SetupPage() {
    const bookmarkletCode = `javascript:(function(){var t=window.getSelection().toString();var u=window.location.href;var t=t||prompt('Enter note (or leave blank to save link):');if(t!==null){var f=document.createElement('form');f.setAttribute('method','post');f.setAttribute('action','https://your-site.vercel.app/api/brain/ingest');f.setAttribute('target','_blank');var i1=document.createElement('input');i1.name='source';i1.value='web';f.appendChild(i1);var i2=document.createElement('input');i2.name='url';i2.value=u;f.appendChild(i2);var i3=document.createElement('input');i3.name='type';i3.value='link';f.appendChild(i3);var i4=document.createElement('input');i4.name='text';i4.value=t;f.appendChild(i4);document.body.appendChild(f);f.submit();document.body.removeChild(f);}})();`;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', color: '#fff', fontFamily: 'sans-serif' }}>
            <h1 style={{ marginBottom: '40px' }}>Second Brain Setup</h1>

            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ borderBottom: '2px solid #4ecdc4', display: 'inline-block', marginBottom: '20px' }}>
                    1. The Bookmarklet
                </h2>
                <p style={{ marginBottom: '20px', lineHeight: '1.6', color: '#ccc' }}>
                    Drag this button to your bookmarks bar. When you are on any webpage:
                    <br />1. Highlight text you want to save.
                    <br />2. Click the bookmarklet.
                    <br />3. It will save the link + the highlighted snippet to your brain.
                </p>

                <div style={{ padding: '20px', background: '#333', borderRadius: '8px', textAlign: 'center' }}>
                    <a
                        href={bookmarkletCode}
                        style={{
                            background: '#4ecdc4', color: '#000', padding: '15px 30px',
                            borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none',
                            fontSize: '1.2rem', cursor: 'grab'
                        }}
                        onClick={e => e.preventDefault()}
                    >
                        Save to Brain
                    </a>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px', textAlign: 'center' }}>
                    (Make sure to replace `your-site.vercel.app` in the code with your actual domain after deployment)
                </p>
            </section>

            <section>
                <h2 style={{ borderBottom: '2px solid #ff6b6b', display: 'inline-block', marginBottom: '20px' }}>
                    2. Telegram Bot
                </h2>
                <ol style={{ lineHeight: '1.8', color: '#ccc' }}>
                    <li>Open <strong>@BotFather</strong> on Telegram.</li>
                    <li>Create a new bot (`/newbot`) and get the <strong>API Token</strong>.</li>
                    <li>Set the connection by visiting this URL in your browser:</li>
                    <code style={{ display: 'block', padding: '15px', background: '#111', margin: '10px 0', borderRadius: '4px', wordBreak: 'break-all' }}>
                        https://api.telegram.org/bot&lt;YOUR_BOT_TOKEN&gt;/setWebhook?url=https://your-site.vercel.app/api/brain/telegram?token=YOUR_SECRET_TOKEN
                    </code>
                    <li>Replace <code>YOUR_BOT_TOKEN</code> with the token from BotFather.</li>
                    <li>Replace <code>your-site.vercel.app</code> with your actual domain.</li>
                    <li>Replace <code>YOUR_SECRET_TOKEN</code> with a random password you set in your env vars.</li>
                </ol>
            </section>
        </div>
    )
}
