import React from 'react';

const UserIcon = ({active}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="32" viewBox="0 0 38 32">
    <g fill="none" fillRule="evenodd">
        <g fillRule="nonzero">
            <g>
                <path fill="#000" d="M33.671 14.765c-1.38-.756-3.967-.765-4.077-.765-.328 0-.594.292-.594.652 0 .36.266.651.594.651.668 0 2.607.113 3.546.628.085.047.176.069.265.069.218 0 .428-.132.532-.36.147-.322.028-.714-.266-.875z" transform="translate(-22 -478) translate(22 478)"/>
                <path fill="#31326F" fillOpacity={`${active ? "1" : ".8"}`} d="M36.301 23.496l-2.299-.754c-.099-.032-.168-.138-.168-.256v-.88c.187-.15.365-.315.532-.501.808-.9 1.253-2.107 1.253-3.398v-1.215l.223-.51c.244-.56.373-1.186.373-1.812v-3.29c0-.353-.25-.64-.557-.64H30.3c-1.948 0-3.532 1.819-3.532 4.053v.038c0 .52.107 1.042.31 1.507l.285.654v1.043c0 1.653.71 3.136 1.785 4.028v.923c0 .142 0 .2-.459.351l-1.122.368-3.245-1.353c.012-.176-.04-.355-.151-.49l-1.037-1.249v-2.098c.11-.103.217-.21.322-.322 1.308-1.407 2.058-3.392 2.058-5.448v-1.676c.395-.986.596-2.029.596-3.103V.639c0-.353-.25-.639-.557-.639h-8.333c-2.932 0-5.318 2.737-5.318 6.1v1.366c0 1.074.2 2.118.596 3.104v1.441c0 2.387.925 4.537 2.38 5.955v2.147l-1.037 1.25c-.111.134-.163.313-.151.489l-3.425 1.428c-.248.104-.479.244-.688.414l-.538-.309c1.6-.8 2.108-1.923 2.132-1.98.079-.179.079-.39 0-.57-.4-.92-.45-2.608-.489-3.964-.013-.452-.025-.878-.048-1.258-.19-3.063-2.22-5.372-4.722-5.372-2.502 0-4.532 2.31-4.721 5.372-.024.38-.036.806-.05 1.258-.038 1.356-.087 3.043-.488 3.964-.078.18-.078.391 0 .57.024.057.53 1.179 2.134 1.979l-1.493.857C.496 24.699 0 25.62 0 26.644v4.717c0 .353.25.639.557.639.307 0 .556-.286.556-.639v-4.717c0-.538.26-1.02.68-1.261l1.86-1.067.647.705c.452.494 1.033.74 1.613.74.58 0 1.161-.247 1.614-.74l.647-.705.606.348c-.286.524-.448 1.139-.448 1.783v4.914c0 .353.25.639.557.639.307 0 .557-.286.557-.639v-4.914c0-.877.482-1.667 1.2-1.967l3.611-1.506 1.503 2.587c.193.33.5.543.845.582.039.004.077.006.115.006.304 0 .596-.137.813-.387l.917-1.052v6.651c0 .353.25.639.557.639.307 0 .557-.286.557-.639v-6.65l.917 1.051c.217.25.509.387.813.387.038 0 .076-.002.115-.006.344-.04.652-.251.845-.582l1.503-2.587 3.61 1.507c.719.3 1.201 1.09 1.201 1.966v4.914c0 .353.25.639.557.639.307 0 .557-.286.557-.639v-4.914c0-.888-.308-1.72-.824-2.336l.138-.045c.138-.046.328-.108.518-.215l1.421 1.63v5.88c0 .353.25.639.557.639.307 0 .556-.286.556-.639v-5.88l1.412-1.619c.075.044.153.081.236.108l2.3.754c.524.172.89.73.89 1.355v5.282c0 .353.25.639.557.639.308 0 .557-.286.557-.639V26.08c0-1.193-.699-2.256-1.699-2.583zm-32.73-1.128c-1.041-.43-1.563-1.003-1.786-1.316.152-.456.25-.978.317-1.529.307.844.821 1.565 1.469 2.08v.765zm3.189 1.728c-.475.517-1.219.517-1.693 0l-.518-.565c.087-.187.135-.4.135-.623v-.68c.389.139.802.214 1.23.214.427 0 .84-.076 1.228-.214v.68c0 .223.048.436.135.624l-.517.564zm-.847-2.931c-1.662 0-3.014-1.552-3.014-3.458 0-.353-.25-.639-.557-.639-.03 0-.061.004-.09.01 0-.055.002-.11.004-.165.012-.439.024-.853.046-1.21.071-1.146.471-2.204 1.126-2.976.66-.78 1.543-1.209 2.485-1.209.943 0 1.825.43 2.486 1.209.655.772 1.054 1.83 1.125 2.977.022.355.034.77.047 1.209l.003.114c-.605-1.07-1.54-1.86-2.75-2.305-1.116-.411-2.076-.386-2.116-.384-.146.004-.284.074-.386.195l-1.004 1.194c-.213.254-.207.659.014.903.222.245.574.238.787-.016l.836-.994c.72.04 3.035.349 3.936 2.624-.227 1.676-1.483 2.92-2.978 2.92zm2.342 1.205v-.762c.648-.511 1.163-1.23 1.47-2.081.067.55.165 1.07.317 1.525-.222.31-.747.888-1.787 1.318zm5.357-10.359v-1.584c0-.096-.019-.191-.055-.278-.359-.85-.54-1.754-.54-2.683V6.1c0-2.66 1.886-4.823 4.204-4.823h7.776v6.189c0 .93-.181 1.832-.54 2.683-.036.087-.055.182-.055.278v1.818c0 1.73-.606 3.333-1.706 4.516-.138.148-.28.286-.428.415l-.01.008c-1.03.898-2.293 1.334-3.611 1.236-2.823-.21-5.035-3.025-5.035-6.409zm3.134 12.848c-.004.004-.013.015-.03.013-.019-.002-.026-.015-.03-.02l-1.73-2.979.557-.671 2.626 2.06-1.393 1.597zm2.261-2.464l-3.014-2.364V18.84c.78.484 1.653.787 2.582.856.147.01.292.016.438.016 1.064 0 2.089-.292 3.008-.846v1.166l-3.014 2.364zm2.32 2.457c-.003.006-.01.018-.028.02-.018.003-.027-.008-.031-.013l-1.393-1.598 2.626-2.059.558.672-1.732 2.978zm10.165-.538l-1.264-1.45c.022-.114.035-.24.035-.379v-.27c.35.133.72.211 1.102.224.043.002.085.003.128.003.423 0 .835-.074 1.228-.213v.257c0 .127.013.252.04.372l-1.27 1.456zm2.099-4.126c-.59.657-1.37 1.004-2.192.975-1.611-.056-2.922-1.683-2.922-3.628v-1.194c0-.099-.02-.197-.059-.285l-.343-.79c-.126-.288-.193-.612-.193-.935v-.038c0-1.53 1.085-2.775 2.42-2.775h4.8v2.652c0 .429-.09.858-.256 1.241l-.281.645c-.039.088-.059.186-.059.285v1.366c0 .943-.325 1.824-.915 2.481z" transform="translate(-22 -478) translate(22 478)"/>
                <path fill="#31326F" fillOpacity={`${active ? "1" : ".8"}`} d="M35.5 27c-.276 0-.5.266-.5.594v3.812c0 .328.224.594.5.594s.5-.266.5-.594v-3.812c0-.328-.224-.594-.5-.594zM2.5 27c-.276 0-.5.316-.5.705v3.59c0 .39.224.705.5.705s.5-.316.5-.705v-3.59c0-.39-.224-.705-.5-.705zM23.845 7.067c-2.006-2.633-6.203-2.13-7.915-1.79-.539.106-.93.705-.93 1.423v1.604c0 .384.237.696.53.696.293 0 .53-.312.53-.696V6.7c0-.024.013-.044.028-.047.684-.135 2.04-.344 3.446-.22 1.654.144 2.852.689 3.56 1.619.208.272.544.272.75 0 .208-.272.208-.713 0-.985zM12.5 28c-.276 0-.5.285-.5.637v2.726c0 .352.224.637.5.637s.5-.285.5-.637v-2.726c0-.352-.224-.637-.5-.637zM25.5 28c-.276 0-.5.285-.5.637v2.726c0 .352.224.637.5.637s.5-.285.5-.637v-2.726c0-.352-.224-.637-.5-.637z" transform="translate(-22 -478) translate(22 478)"/>
            </g>
        </g>
    </g>
</svg>
)

export default UserIcon;