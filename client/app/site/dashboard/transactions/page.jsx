import { getTransactions } from "@/actions/serverActions";
import TransactionsClient from "./_components/transactions-client";

const transactionsPage = async () => {
  const data = await getTransactions();
  return (
    <div>
      <TransactionsClient transactionsData={data}/>
    </div>
  );
};

export default transactionsPage;
