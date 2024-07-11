import { Root } from '../../lib/contracts/root'
import artifact from '../../../artifacts/root.json'
import { DefaultProvider, bsv } from 'scrypt-ts'
import { NeucronSigner } from 'neucron-signer'

const provider = new DefaultProvider({ network: bsv.Networks.mainnet })
const signer = new NeucronSigner(provider)
await signer.login('sales@timechainlabs.io', 'string')
await Root.loadArtifact(artifact)
let instance: any;

export const actions = {

    deploy: async ({ request }) => {
        const data = await request.formData();
        const square = BigInt(Number(data.get('square')));
        instance = new Root(square)
        await instance.connect(signer)
        try {
            const deployTx = await instance.deploy(Number(data.get("bounty")));

            console.log(
                'smart lock deployed : https://whatsonchain.com/tx/' + deployTx.id
            )
            return { success: true, tx: deployTx.id };
        } catch (error: any) {
            console.log(error.message);
            return { success: false, tx: error.message };
        }
    },
    unlock: async ({ request }) => {

        const data = await request.formData();
        const root = Number(data.get('root'));
        await instance.connect(signer);
        // Call the unlock method
        try {
            const { tx: callTx } = await instance.methods.unlock(root);
            console.log(
                "contract unlocked successfully : https://whatsonchain.com/tx/" +
                callTx.id
            );
            return { success: true, tx: callTx.id };
        } catch (error: any) {
            console.log(error.message);
            return { success: false, tx: error.message };
        }
    },

};
