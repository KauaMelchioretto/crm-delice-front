import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

export const LeadRegisteredWithSuccess = () => (
    <div
        style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #b38940 0%, #d4a556 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}
    >
        <div
            style={{
                background: 'white',
                borderRadius: '24px',
                padding: '60px 40px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                textAlign: 'center',
                animation: 'fadeInScale 0.5s ease-out'
            }}
        >
            <div
                style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 32px',
                    animation: 'checkBounce 0.6s ease-out 0.2s both'
                }}
            >
                <CheckRoundedIcon
                    sx={{
                        fontSize: "4rem",
                        color: "#FFFFFF"
                    }}
                />
            </div>
            <h1
                style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '16px',
                    lineHeight: '1.2'
                }}
            >
                Cadastro Realizado com Sucesso!
            </h1>
            <p
                style={{
                    fontSize: '18px',
                    color: '#6b7280',
                    marginBottom: '32px',
                    lineHeight: '1.6'
                }}
            >
                Obrigado pelo seu interesse na <strong style={{color: '#b38940'}}>Delice</strong>!
                <br/>
                Nossa equipe comercial entrará em contato em breve para apresentar nossos produtos e soluções.
            </p>
            <div
                style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
                    margin: '32px 0'
                }}
            />
            <div
                style={{
                    background: '#fef3c7',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '24px'
                }}
            >
                <p
                    style={{
                        fontSize: '14px',
                        color: '#92400e',
                        margin: 0,
                        lineHeight: '1.5'
                    }}
                >
                    <strong>📧 Verifique seu e-mail</strong>
                    <br/>
                    Enviamos uma confirmação para o endereço cadastrado.
                </p>
            </div>
            <p
                style={{
                    fontSize: '13px',
                    color: '#9ca3af',
                    marginTop: '24px',
                    marginBottom: 0
                }}
            >
                Delice Indústria de Biscoitos LTDA
            </p>
        </div>
        <style>
            {`
                @keyframes fadeInScale {
                  from {
                    opacity: 0;
                    transform: scale(0.9);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
        
                @keyframes checkBounce {
                  0% {
                    opacity: 0;
                    transform: scale(0);
                  }
                  50% {
                    transform: scale(1.1);
                  }
                  100% {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
            `}
        </style>
    </div>
);