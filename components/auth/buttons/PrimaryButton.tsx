.button{
    width:100%;
    height:56px;

    border:none;
    border-radius:18px;

    background:linear-gradient(135deg,#2563EB,#4F46E5);

    color:#fff;

    font-size:16px;
    font-weight:600;

    cursor:pointer;

    transition:.25s;
}

.button:hover{
    transform:translateY(-2px);
    box-shadow:0 15px 35px rgba(37,99,235,.30);
}

.button:disabled{
    opacity:.5;
    cursor:not-allowed;
}