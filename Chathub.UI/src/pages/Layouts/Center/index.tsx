
function CenterLayout(props: React.PropsWithChildren) {
    return (
        <div className="w-screen h-screen bg-slate-200">
            <div className="min-w-min min-h-min w-fit h-fit absolute left-0 right-0 top-0 bottom-0 m-auto p-2 border-0 bg-white rounded-lg">
                {props.children}
            </div>
        </div>
    )
}

export default CenterLayout;