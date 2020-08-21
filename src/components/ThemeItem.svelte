<script>
    
</script>

<div class='theme'>
    <div class='text'>
        <slot name='text'></slot>
    </div>
    <div class='buttons'>
        <slot name='buttons'></slot>
    </div>
</div>


<style>
    .text {
        margin-right:15px
    }

    .buttons {
        display:flex;
        flex-direction:row;
        justify-content:space-evenly

    }

    .theme {
        margin-top:15px;
        display:flex;
        flex-direction:row;
        justify-content: flex-start;
        align-items: center;
    }
</style>