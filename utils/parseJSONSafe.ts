export const parseJSONSafe = (json: string) => {
    try{
        return JSON.parse(json)
    } catch (e){
        return
    }
}