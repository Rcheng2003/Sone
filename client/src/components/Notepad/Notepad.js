const Note = () => {
    return(
        <div className='note'>
            <textarea 
                rows='8'
                cols='10'
                placeholder='Type...'
            ></textarea>
            {/* <div className='note-footer'>
                <small>200 remaining</small>
                <button className='clear'>Clear</button>
            </div> */}
        </div>
    );
};

export default Note;